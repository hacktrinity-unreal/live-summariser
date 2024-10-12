import contextlib
import shutil
import tempfile


@contextlib.contextmanager
def make_temp_directory():
    """Make a temporary directory for saving files to storage and discarding once finished with
    Usage:
    ```python
    from utils import make_temp_directory
    with make_temp_directory() as temp_dir:
        file_path = f"{temp_dir}/my_file.txt"
        ...
    ```
    """
    temp_directory = tempfile.mkdtemp()
    try:
        yield temp_directory
    finally:
        shutil.rmtree(temp_directory)
